import React, { useEffect, useState } from 'react';
import { Box, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Button} from "@chakra-ui/react";
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
                    console.log("town record");
                    console.log(err.message);
                }
            }
        }

    useEffect(()=>{
        getCreatedTowns();
    }, [username, currentCreatedTowns, setCurrentCreatedTowns]);

    
    const handleDelete = async(townID: any, townPassword: any) => {
        const DELETETOWN_URL = `/towns/${townID}/${townPassword}`;
        try {
            const response = await axios.delete(
                DELETETOWN_URL,
                {
                headers: { 'Content-Type': 'application/json', 
                'x-access-token':  token},
                }
            );
            console.log(response);
            } catch (err) {
                if (err instanceof Error) {
                    console.log("town delete");
                    console.log(err.message);
                }
            }
    }

    const deleteConfirm = (townID: any, townPassword: any) => {
        if(window.confirm(`Are you sure you want to delete the town ${townID}? \nYou will lose all the information about this town, and it is not retrievable!`)){
          console.log('sure')
        //   window.location.href = `./signin`;
          return handleDelete(townID, townPassword);
        }
          console.log('cancel');
          return false;
      }

    return (
            <Box maxH="500px" overflowY="scroll">
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption placement="bottom">User Created Towns</TableCaption>
                        <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Town Password</Th><Th>Activity</Th></Tr></Thead>
                        <Tbody>
                            {currentCreatedTowns?.map((town) => (
                            <Tr key={town.coveyTownId}><Td role='cell'>{town.friendlyName}</Td><Td
                                role='cell'>{town.coveyTownId}</Td>
                                <Td role='cell'>{town.townUpdatePassword}
                                </Td>
                                <Td role='cell'>
                                    <Button onClick={() => deleteConfirm(town.coveyTownId, town.townUpdatePassword)}>Delete</Button></Td>
                            </Tr>
                            ))}
                        </Tbody>
                </Table>
            </Box>
         )   
}

