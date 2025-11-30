import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  getDoc,
  query,
  orderBy 
} from 'firebase/firestore';

/**
 * 즐겨찾기 추가
 * @param {string} userId - 사용자 전화번호
 * @param {string} medicineName - 의약품 이름
 * @param {object} sectionData - 섹션 데이터
 */
export const addFavorite = async (userId, medicineName, sectionData) => {
  try {
    const { sectionNumber, sectionTitle, sectionIcon, content } = sectionData;
    
    // 의약품 document 경로
    const medicineDocRef = doc(db, 'users', userId, 'favorites', medicineName);
    
    // 의약품 document가 없으면 생성
    const medicineDoc = await getDoc(medicineDocRef);
    if (!medicineDoc.exists()) {
      await setDoc(medicineDocRef, {
        medicineName: medicineName,
        createdAt: new Date().toISOString(),
      });
    }
    
    // 섹션 추가
    const sectionDocRef = doc(
      db, 
      'users', 
      userId, 
      'favorites', 
      medicineName, 
      'sections', 
      String(sectionNumber)
    );
    
    await setDoc(sectionDocRef, {
      sectionNumber,
      sectionTitle,
      sectionIcon,
      content,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error);
    return { success: false, error };
  }
};

/**
 * 즐겨찾기 삭제
 */
export const removeFavorite = async (userId, medicineName, sectionNumber) => {
  try {
    const sectionDocRef = doc(
      db,
      'users',
      userId,
      'favorites',
      medicineName,
      'sections',
      String(sectionNumber)
    );
    
    await deleteDoc(sectionDocRef);
    
    // 해당 의약품의 모든 섹션 확인
    const sectionsRef = collection(
      db,
      'users',
      userId,
      'favorites',
      medicineName,
      'sections'
    );
    const sectionsSnapshot = await getDocs(sectionsRef);
    
    // 섹션이 하나도 없으면 의약품 document도 삭제
    if (sectionsSnapshot.empty) {
      const medicineDocRef = doc(db, 'users', userId, 'favorites', medicineName);
      await deleteDoc(medicineDocRef);
    }
    
    return { success: true };
  } catch (error) {
    console.error('즐겨찾기 삭제 실패:', error);
    return { success: false, error };
  }
};

/**
 * 특정 섹션이 즐겨찾기 되어있는지 확인
 */
export const isFavorited = async (userId, medicineName, sectionNumber) => {
  try {
    const sectionDocRef = doc(
      db,
      'users',
      userId,
      'favorites',
      medicineName,
      'sections',
      String(sectionNumber)
    );
    
    const sectionDoc = await getDoc(sectionDocRef);
    return sectionDoc.exists();
  } catch (error) {
    console.error('즐겨찾기 확인 실패:', error);
    return false;
  }
};

/**
 * 모든 즐겨찾기 가져오기 (의약품별로 그룹화)
 */
export const getAllFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const favoritesSnapshot = await getDocs(favoritesRef);
    
    const favorites = [];
    
    for (const medicineDoc of favoritesSnapshot.docs) {
      const medicineName = medicineDoc.id;
      const medicineData = medicineDoc.data();
      
      // 해당 의약품의 섹션들 가져오기
      const sectionsRef = collection(
        db,
        'users',
        userId,
        'favorites',
        medicineName,
        'sections'
      );
      const sectionsQuery = query(sectionsRef, orderBy('sectionNumber'));
      const sectionsSnapshot = await getDocs(sectionsQuery);
      
      const sections = sectionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      favorites.push({
        medicineName,
        createdAt: medicineData.createdAt,
        sections,
      });
    }
    
    // 최신순 정렬
    favorites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return favorites;
  } catch (error) {
    console.error('즐겨찾기 목록 가져오기 실패:', error);
    return [];
  }
};