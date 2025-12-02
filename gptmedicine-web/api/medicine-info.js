import { BigQuery } from "@google-cloud/bigquery";

export default async function handler(req, res) {

    // BigQuery credentials read from Vercel environment variable
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    const bigquery = new BigQuery({
        projectId: serviceAccount.project_id,
        credentials: {
            client_email: serviceAccount.client_email,
            private_key: serviceAccount.private_key
        }
    });

    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ error: "name is required" });

        const query = `
            SELECT *
            FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
            WHERE product_name LIKE '%${name}%'
               OR product_name_en LIKE '%${name}%'
        `;

        const [rows] = await bigquery.query({ query });

        if (rows.length === 0) {
            return res.json({ found: false, item: null });
        }

        return res.json({ found: true, item: rows[0] });

    } catch (error) {
        console.error("BigQuery Error:", error);
        return res.status(500).json({ error: "BigQuery lookup failed" });
    }
}
