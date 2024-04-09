import { useEffect, useState } from "react";

export default function useDebouncedString(delay = 333): [string, string, React.Dispatch<React.SetStateAction<string>>] {
    const [debouncedString, setDebouncedString] = useState("");
    const [string, setString] = useState("");

    useEffect(() => {
        const id = setTimeout(() => setDebouncedString(string), delay);
        return () => clearTimeout(id);
    }, [string, delay]);

    return [debouncedString, string, setString];
}