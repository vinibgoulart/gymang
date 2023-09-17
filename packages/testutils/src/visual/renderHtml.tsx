export type RenderHtml = {
  html: string;
  styledComponentStyleTags: string;
  muiStyleTags: string;
};
export const renderHtml = ({
  html,
  styledComponentStyleTags,
  muiStyleTags,
}: RenderHtml) => `
    <!doctype html>
      <html lang="">
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${styledComponentStyleTags}
          ${
            muiStyleTags ? `<style id='jss-ssr'>${muiStyleTags}</style>` : ''
          }                  
          <style>
            html, body {
              font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            }
        </style>
      </head>
      <body>
        <div id="root">${html}</div>        
      </body>
    </html>
  `;
