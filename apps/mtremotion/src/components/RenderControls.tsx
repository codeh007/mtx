import type { z } from "zod";
import { useRendering } from "../helpers/use-rendering";
import type { MainSenceSchema } from "../types/schema";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { Input } from "./Input";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";

export const RenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputProps: z.infer<typeof MainSenceSchema>;
}> = ({ text, setText, inputProps }) => {
  const { renderMedia, state, undo } = useRendering("MyComp", inputProps);

  return (
    <InputContainer>
      {state.status === "init" || state.status === "invoking" || state.status === "error" ? (
        <>
          <Input disabled={state.status === "invoking"} setText={setText} text={text} />
          <Spacing />
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "error" ? <ErrorComp message={state.error.message} /> : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar progress={state.status === "rendering" ? state.progress : 1} />
          <Spacing />
          <AlignEnd>
            <DownloadButton undo={undo} state={state} />
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
