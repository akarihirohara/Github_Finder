// =============================================
// 役割: ルーティングマップ（URL → コンポーネント）
// =============================================
import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";                       // 共通レイアウト（ヘッダー/フッター）
import Home from "./pages/Home";                            // 検索ページ
import UserDetail from "./pages/UserDetail";                // 詳細ページ
import About from "./pages/About";                          // About ページ


// ルート配下に子ルートをネストする構成
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },                                     // "/" にアクセスしたときの初期ページ
            { path: "user/:login", element: <UserDetail /> },                       // "/user/octocat" のような動的ルート
            { path: "about", element: <About /> },
            { path: "*", element: <div style={{ padding: 24 }}>Not Found</div> },   // 未定義パスのフォールバック
        ],
    },
]);