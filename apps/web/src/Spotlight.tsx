import {
  Command,
  SpotlightSearchInput,
  SpotlightSearchResults,
  SpotlightWrapper,
  useSpotlightSearch,
} from "@codewaffle/components";
import { CommandTypes } from "@codewaffle/domain";
import { ScriptExtension, scriptList } from "@codewaffle/transformers";
import { useKeyPress } from "@codewaffle/utils";
import { command$ } from "./store";

export function Spotlight() {
  const handleSubmit = (command: Command<ScriptExtension>) => {
    command$.next({
      type: CommandTypes.PERFORM_TRANSFORM,
      key: command.key,
    });
  };

  const handleClose = () => {
    command$.next({ type: CommandTypes.SEARCH_CLOSED });
  };

  const spotlight = useSpotlightSearch<ScriptExtension>({
    commands: scriptList,
    onSubmit: handleSubmit,
    onClose: handleClose,
  });

  const handleKeyPress = () => spotlight.openSpotlight();
  useKeyPress("k", handleKeyPress);

  return (
    <SpotlightWrapper visible={spotlight.visible} onClose={spotlight.closeSearch}>
      <SpotlightSearchInput
        ref={spotlight.inputRef}
        onSelectUp={spotlight.selectUp}
        onSelectDown={spotlight.selectDown}
        onSearch={spotlight.handleSearch}
        onClose={spotlight.closeSearch}
        onEnter={spotlight.onSubmit}
        onReset={spotlight.resetSearch}
        resultCount={spotlight.hits.length}
      />
      <SpotlightSearchResults
        results={spotlight.hits}
        activeResult={spotlight.activeHit}
        handleResultSelect={spotlight.handleHitClick}
        onSubmit={spotlight.onSubmit}
      />
    </SpotlightWrapper>
  );
}
