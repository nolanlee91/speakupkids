// ESLint flat config — eslint-config-next v16 export sẵn mảng flat, import thẳng.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: ["node_modules/**", ".next/**", "out/**", "supabase/functions/**", "landing-page/**", "next-env.d.ts"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Nội dung tiếng Việt dùng nhiều dấu nháy trong JSX — không bắt escape.
      "react/no-unescaped-entities": "off",
      // App dùng <img> thường (static export, ảnh local) — không ép next/image.
      "@next/next/no-img-element": "off",
      // Nhóm rule React-Compiler strict: code hiện tại có các pattern init-trong-effect
      // đang chạy đúng — để warn cho thấy đường dọn dần, không chặn CI.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
