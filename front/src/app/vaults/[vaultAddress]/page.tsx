"use client";

import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAddress } from "viem";

const VaultPage: NextPage = () => {

   const { vaultAddress } = useParams();
    const isValidAddress = isAddress(vaultAddress as string);


    return (
        <>
            <main className="bg-gray-50 min-h-screen">
                

                {isValidAddress && (
                    <>
                        <h1>Vault detail</h1>
                        <p>{vaultAddress}</p>
                    </>
                )}

                
                {!isValidAddress && (
                    <>
                        {/* TODO: */}
                        <h2>Not a valid address</h2> 
                    </>
                )}
                

                
            </main>
        </>
    )

}

export default VaultPage;
