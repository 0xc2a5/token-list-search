import { TokenInfo } from "@uniswap/token-lists";
import { useEffect, useState } from "react";
import { isAddress } from "viem";

function compare(query: string, searchString: string): boolean {
    return searchString.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
}

export default function useSearchResults(query: string, tokens: TokenInfo[]): TokenInfo[] {
    const [searchResults, setSearchResults] = useState<TokenInfo[]>([]);

    useEffect(() => {
        let results;
        if (isAddress(query)) {
            results = tokens.filter(t => compare(query, t.address));
        }
        else if (query.length) {
            results = tokens.filter(t => compare(query, t.name) || compare(query, t.symbol));
        }
        else {
            results = tokens;
        }

        setSearchResults(results);
    }, [query, tokens]);

    return searchResults;
}