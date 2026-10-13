import "./preview.css";
import { useRef, useEffect } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
<html>
  <head>
    <style>
      html {
        background-color: white;
      }
    </style>
  </head>

  <body>
    <div id="root"></div>

    <script>
      const handleError = (err) => {
        const root = document.querySelector('#root');

        root.innerHTML =
          '<div style="color: red;">' +
          '<h4>Runtime Error</h4>' +
          err +
          '</div>';

        console.error(err);
      };

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error);
      });

      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (err) {
          handleError(err);
        }
      });
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeElement = iframe.current;

    if (!iframeElement) {
      return;
    }

    iframeElement.srcdoc = html;

    const timer = setTimeout(() => {
      iframeElement.contentWindow?.postMessage(code, "*");
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe title="preview" ref={iframe} sandbox="allow-scripts" />

      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
