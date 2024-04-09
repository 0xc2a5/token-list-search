import { TokenInfo, TokenList } from "@uniswap/token-lists";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

async function getTokenList(url: string): Promise<TokenList> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Network response error");
    }

    return await response.json();
}

function compare(a: TokenInfo, b: TokenInfo) {
    if (a.symbol < b.symbol) {
        return -1;
    }
    else if (a.symbol > b.symbol) {
        return 1;
    }
    else {
        return 0;
    }
}

export default function useTokenList(chainId: number, url: string): TokenInfo[] {
    const [filteredTokenList, setFilteredTokenList] = useState<TokenInfo[]>([]);

    const { data } = useSuspenseQuery({
        queryKey: ["getTokenList", url],
        queryFn: ({ queryKey }) => getTokenList(queryKey[1])
    });

    useEffect(() => {
        if (data?.tokens.length) {
            const tokens = data?.tokens
                .filter(t => t.chainId === chainId && t.name && t.symbol)
                .sort(compare);

            setFilteredTokenList(tokens);
        }
    }, [chainId, data]);

    return filteredTokenList;
}