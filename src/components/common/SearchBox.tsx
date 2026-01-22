import { TextField, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchBox() {
    const isMobile = useMediaQuery("(max-width: 600px)");
    
    const [searchParams,setSearchParams] = useSearchParams();
    const [draftSearch, setDraftSearch] = useState(searchParams.get("search") || "");

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                if(draftSearch){
                    params.set("search", draftSearch);
                } else { 
                    params.delete("search");
                }

                return params;
            })
        },350)

        return () => clearTimeout(timeout);
    },[draftSearch])

    useEffect(()=>{
        setDraftSearch(searchParams.get("search") || "");
    },[searchParams])

    return (
        <TextField
        size="small"
        label="Search"
        color="primary"              
        value={draftSearch}
        onChange={(e) => {
            setDraftSearch(e.target.value);
        }}
        sx={{ 
            height: 40,
            minWidth: isMobile ? null : 450,
        }}
        />
    )
}