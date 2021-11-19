import {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useRef,
  useState,
} from "react";
import debounce from "lodash.debounce";
import Fuse from "fuse.js";
import { useKeyPress } from "../utils/useKeyPress";
import { TransformDefinition, TransformList } from "../transforms";
import { StyledBackdrop, StyledSpotlight } from "./Spotlight.style";
import { StyledInput } from "./Input";
import { StyledSearchResults } from "./SearchResults";

export type Props = {
  scripts: TransformList;
};

export const SPOTLIGHT_LABEL = "Search command...";

export const Spotlight: FC<Props> = ({ scripts }) => {
  const fuse = new Fuse(scripts, { keys: ["label"] });

  const inputRef = useRef<HTMLInputElement>(null);

  const [visible, setVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [hits, setHits] = useState<Fuse.FuseResult<TransformDefinition>[]>([]);
  const [activeHit, setActiveHit] = useState<number | null>(null);

  const handleKeyPress = () => setVisible(!visible);
  useKeyPress("k", handleKeyPress);

  const closeSearch = () => {
    setVisible(false);
    resetSearch();
  };

  const resetSearch = () => {
    setSearchInput("");
    setHits([]);
    setActiveHit(null);
  };

  const selectUp = () =>
    activeHit !== null && activeHit > 0
      ? setActiveHit(activeHit - 1)
      : undefined;
  const selectDown = () =>
    activeHit !== null && activeHit < hits.length - 1
      ? setActiveHit(activeHit + 1)
      : undefined;

  const handleKeyboardShortcuts: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    switch (event.key) {
      case "ArrowUp":
        selectUp();
        event.preventDefault();
        break;
      case "ArrowDown":
        selectDown();
        event.preventDefault();
        break;
      case "Tab":
        if (event.shiftKey) {
          selectUp();
        } else {
          selectDown();
        }
        event.preventDefault();
        break;
      case "Enter":
        if (hits.length === 0) break;
        performOperation();
        event.preventDefault();
        break;
      case "Escape":
        if (searchInput !== "") {
          resetSearch();
        } else {
          closeSearch();
        }
        event.preventDefault();
        break;
    }
  };

  const performSearch = debounce((term: string) => {
    const fuzzySearchResults = fuse.search(term);
    setHits(fuzzySearchResults);
    if (fuzzySearchResults.length > 0) {
      setActiveHit(0);
    } else {
      setActiveHit(null);
    }
  }, 500);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchInput(event.target.value);
    performSearch(event.target.value);
  };

  const handleHitClick = (index: number) => {
    setActiveHit(index);
    inputRef.current?.focus();
  };

  const performOperation = () => {
    if (activeHit !== null) {
      console.log("perform operation:", hits[activeHit].item.key);
      closeSearch();
    } else {
      setActiveHit(0);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <StyledBackdrop onClick={closeSearch} />
      <StyledSpotlight>
        <StyledInput
          ref={inputRef}
          type="text"
          placeholder={SPOTLIGHT_LABEL}
          aria-label={SPOTLIGHT_LABEL}
          value={searchInput}
          onChange={handleSearch}
          onKeyDown={handleKeyboardShortcuts}
          autoFocus
        />
        {hits.length > 0 && (
          <StyledSearchResults onClick={() => inputRef.current?.focus()}>
            <ul>
              {hits.map(({ item }, index) => (
                <li
                  key={item.key}
                  className={activeHit === index ? "active" : ""}
                  onClick={() => handleHitClick(index)}
                  onDoubleClick={performOperation}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </StyledSearchResults>
        )}
      </StyledSpotlight>
    </>
  );
};