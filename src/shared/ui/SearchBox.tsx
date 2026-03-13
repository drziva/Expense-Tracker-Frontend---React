import { debounce, TextField, useMediaQuery } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchBox() {
    const inputRef = useRef(null);

    const isMobile = useMediaQuery("(max-width: 700px)");
    
    const [searchParams, setSearchParams] = useSearchParams();

    const debouncedUpdateRef = useRef(
        debounce((value) => {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);

                if(value) {
                    newParams.set("search", value);
                } else {
                    newParams.delete("search");
                }
                return newParams;
            })
        }, 500)
    );

    useEffect(() => {
        const search = searchParams.get("search") || "";
        if (inputRef.current) {
            (inputRef.current as HTMLInputElement).value = search;
        }
    }, [searchParams])

    return (
        <TextField
            inputRef={inputRef}
            size="small"
            label="Search"
            color="primary"      
            onChange={(e) => {
                debouncedUpdateRef.current(e.target.value);
            }}
            sx={{ 
                height: 40,
                width: isMobile ? "100%" : "auto",
                minWidth: isMobile ? null : 450,
            }}
        />
    )
}