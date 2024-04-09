import { useState } from "react"
import TokenListSearch from "./components/TokenListSearch"
import { TokenInfo } from "@uniswap/token-lists";

function App() {
    function onClick(token: TokenInfo) {
        alert(JSON.stringify(token, null, 2));
    }

    return (
        <>
            <h1>TokenListSearch Component</h1>
            <TokenListSearch
                chainId={1}
                onClickToken={onClick}
                url={import.meta.env.VITE_TOKEN_LIST}
            />
        </>
    )
}

export default App