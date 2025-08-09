import { Font } from "@react-email/components";

export function ManropeFont() {
  return (
    <Font
      fontFamily="Manrope"
      fallbackFontFamily="Verdana"
      webFont={{
        url: "https://fonts.gstatic.com/s/manrope/v19/xn7gYHE41ni1AdIRggmxSvfedN62Zw.woff2",
        format: "woff2",
      }}
      fontWeight={400}
      fontStyle="normal"
    />
  );
}
