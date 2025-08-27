// =============================================
// 役割: アプリのエントリポイント。Router を組み込み、
// =============================================
import React from "react";                         
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";                       // ルーティング定義
import "./styles/globals.css";                           // 全体スタイル

// React の描画開始。RouterProvider でルーティングを有効化
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);