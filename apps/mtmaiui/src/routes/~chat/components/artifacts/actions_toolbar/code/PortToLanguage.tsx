import type { CanvasGraphParams } from "mtmaiapi";
import type { ProgrammingLanguageOptions } from "mtmaiapi/gomtmapi";
// import { ProgrammingLanguageList } from "../../../programming-lang-dropdown.tsx--";

export interface PortToLanguageOptionsProps {
  streamMessage: (params: CanvasGraphParams) => Promise<void>;
  handleClose: () => void;
  language: ProgrammingLanguageOptions;
}

const prettifyLanguage = (language: ProgrammingLanguageOptions) => {
  switch (language) {
    case "php":
      return "PHP";
    case "typescript":
      return "TypeScript";
    case "javascript":
      return "JavaScript";
    case "cpp":
      return "C++";
    case "java":
      return "Java";
    case "python":
      return "Python";
    case "html":
      return "HTML";
    case "sql":
      return "SQL";
    default:
      return language;
  }
};

// export function PortToLanguageOptions(props: PortToLanguageOptionsProps) {
//   const { streamMessage } = props;
//   const { toast } = useToast();

//   const handleSubmit = async (portLanguage: ProgrammingLanguageOptions) => {
//     if (portLanguage === props.language) {
//       toast({
//         title: "Port language error",
//         description: `The code is already in ${prettifyLanguage(portLanguage)}`,
//         duration: 5000,
//       });
//       props.handleClose();
//       return;
//     }

//     props.handleClose();
//     await streamMessage({
//       portLanguage,
//     });
//   };

//   return <ProgrammingLanguageList handleSubmit={handleSubmit} />;
// }
