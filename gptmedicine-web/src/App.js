import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./page/Main";

<Routes>
  <Route path="/" element={<Flashback />} />
  <Route path="/loginjoin" element={<LoginJoin />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* 🔥 로그인해야 접근 가능한 페이지 */}
  <Route
    path="/main"
    element={
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    }
  />
</Routes>
