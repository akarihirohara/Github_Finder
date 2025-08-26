// =============================================
// 役割: アプリのエントリポイント。Router を組み込み、
// 生成した favicon を <head> に差し込む（インポート方式）。
// =============================================
import iconUrl from "./assets/github-finder-icon.png";   // Vite がハッシュ付きURLに変換する静的アセット
import React from "react";                         
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";                       // ルーティング定義
import "./styles/globals.css";                           // 全体スタイル

// 既存の <link rel="icon"> を取得。なければ新規作成する
const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]') ?? document.createElement("link");
link.rel = "icon";                  // favicon 指定
link.type = "image/png";            // 画像のMIMEタイプ
link.href = iconUrl + "?v=1";       // キャッシュ回避のためクエリを付与
link.id = "app-favicon";            // 将来の上書き用に id を付けておく（任意）
document.head.appendChild(link);    // <head> に挿入

// React の描画開始。RouterProvider でルーティングを有効化
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);