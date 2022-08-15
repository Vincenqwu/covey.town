import React, { useEffect, useState } from 'react';
import { Box, Table, TableCaption, Thead, Tr, Th, Tbody, Td} from "@chakra-ui/react";
import axios from "../Welcome/api/axios";
import { CoveyTownInfoForUser } from '../../classes/TownsServiceClient';

/**
 * This is the Town Record Component for showing the list of the current user's created towns.
 * @param Props has two params: username and token
 * @returns a html object
 */
export default function TownRecord(Props: { username: any; token : any; }){
    const {username} = Props;
    const {token} = Props;
    const GETTOWN_URL = `/users/${username}/towns`;
    const [currentCreatedTowns, setCurrentCreatedTowns] = useState<CoveyTownInfoForUser[]>();
    const getCreatedTowns = async() => {
        try {
            const response = await axios.get(
                GETTOWN_URL,
                {
                headers: { 'Content-Type': 'application/json', 
                'x-access-token':  token},
                }
            );
            const currentTowns = response.data;
            setCurrentCreatedTowns(currentTowns);
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                }
            }
        }

    useEffect(()=>{
        getCreatedTowns();
    }, [username, currentCreatedTowns, setCurrentCreatedTowns]);

    return (
            <Box maxH="500px" overflowY="scroll">
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption placement="bottom">User Created Towns</TableCaption>
                        <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Town Password</Th></Tr></Thead>
                        <Tbody>
                            {currentCreatedTowns?.map((town) => (
                            <Tr key={town.coveyTownId}><Td role='cell'>{town.friendlyName}</Td><Td
                                role='cell'>{town.coveyTownId}</Td>
                                <Td role='cell'>{town.townUpdatePassword}
                                </Td>
                            </Tr>
                            ))}
                        </Tbody>
                </Table>
            </Box>
         )   
}