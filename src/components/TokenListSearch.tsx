import { useVirtualizer } from "@tanstack/react-virtual";
import { TokenInfo } from "@uniswap/token-lists";
import { Suspense, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useDebouncedString from "../hooks/useDebouncedString";
import useSearchResults from "../hooks/useSearchResults";
import useTokenList from "../hooks/useTokenList";
import "./TokenListSearch.css";

export interface Props {
    chainId: number,
    url: string,
    onClickToken?: (token: TokenInfo) => void
}

export default function TokenListSearch({ chainId, url, onClickToken }: Props) {
    const [debouncedQuery, query, setQuery] = useDebouncedString();
    const [showList, setShowList] = useState(false);
    const listRef = useRef(null);
    const tokens = useTokenList(chainId, url);
    const results = useSearchResults(debouncedQuery, tokens);

    const hideListClass = showList ? "" : "hidden";
    const rowHeight = 55;

    const virtualizer = useVirtualizer({
        count: results.length,
        estimateSize: () => rowHeight,
        getScrollElement: () => listRef.current,
        overscan: 10
    });

    useEffect(() => {
        if (virtualizer.getTotalSize() > 0) {
            virtualizer.scrollToIndex(0);
        }
    }, [debouncedQuery]);

    const listHeight = virtualizer.getTotalSize() < 5 * rowHeight
        ? `${Math.max(virtualizer.getTotalSize(), rowHeight) + 2}px`
        : "200px"

    function handleBlur(event: React.FocusEvent<HTMLElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setShowList(false);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        const index: number = Number(event.currentTarget.dataset.index);
        const token = results[index];

        if (onClickToken) {
            onClickToken(token);
        }

        setShowList(false);
    }

    function handleFocus() {
        if (virtualizer.getTotalSize() > 0) {
            virtualizer.scrollToIndex(0);
        }
        setShowList(true);
    }

    function Error() {
        return <span><b>Error:</b> Unable to load token list.</span>
    }

    function Loading() {
        return <span>Loading...</span>
    }

    function NoResults() {
        return <span className="NoResults">No results found...</span>
    }

    return (
        <div
            className="TokenListSearch"
            onBlur={handleBlur}
        >
            <ErrorBoundary fallback={<Error />}>
                <Suspense fallback={<Loading />}>
                    <input
                        className="Search"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        placeholder="Search tokens by address, name, or symbol."
                        value={query}
                    />
                    <div
                        className={`List ${hideListClass}`}
                        ref={listRef}
                        style={{
                            height: listHeight
                        }}
                    >
                        {virtualizer.getTotalSize() === 0 && <NoResults />}
                        <div
                            style={{
                                height: `${virtualizer.getTotalSize()}px`,
                                position: "relative"
                            }}
                        >
                            {virtualizer.getVirtualItems().map(item => {
                                const token = results[item.index];
                                const { address, logoURI, name, symbol } = token
                                return (
                                    <button
                                        className="Item"
                                        data-index={item.index}
                                        key={item.key}
                                        onClick={handleClick}
                                        style={{
                                            height: `${item.size}px`,
                                            position: "absolute",
                                            transform: `translateY(${item.start}px)`,
                                            width: "100%"
                                        }}
                                    >
                                        <img className="Logo" src={logoURI} />
                                        <div>
                                            <span className="Name">{name}</span>
                                            {" "}
                                            <span className="Symbol">{symbol}</span>
                                            <br />
                                            <span className="Address">{address}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}