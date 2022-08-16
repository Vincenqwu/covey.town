import React, { useEffect, useState } from 'react';
import { Box, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Button, Heading} from "@chakra-ui/react";
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
    const [lastVisitedTown, setLastVisitedTown] = useState<CoveyTownInfoForUser>();
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
            console.log("create town");
            console.log(currentCreatedTowns);
            setCurrentCreatedTowns(currentTowns);
            } catch (err) {
                if (err instanceof Error) {
                    console.log("town create record");
                    console.log(err.message);
                }
            }
        }

    const GETLASTTOWN_URL = `/users/${username}/town/latest`;
    const getLastVisitedTown = async() => {
        try {
            const response = await axios.get(
                GETLASTTOWN_URL,
                {
                headers: { 'Content-Type': 'application/json', 
                'x-access-token':  token},
                }
            );
            const lastTown = response.data;
            console.log(lastTown);
            setLastVisitedTown(lastTown);
            } catch (err) {
                if (err instanceof Error) {
                    console.log("town visit record");
                    console.log(err.message);
                }
            }
        }

    useEffect(()=>{
        getCreatedTowns();
        // getLastVisitedTown();
    }, [username, currentCreatedTowns, lastVisitedTown]);

    useEffect(()=>{
        getLastVisitedTown();
    }, [username, currentCreatedTowns, lastVisitedTown]);

    
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

    const renderPublicOrNot = (isPublic: boolean) => {
        if (isPublic === true) {
            return <Td role='cell'> Public Town</Td>;
        } 
        return <Td role='cell'> Private Town</Td>;
    }
    
    

    return (
            <Box maxH="500px" overflowY="scroll">
                <Heading as='h5' size='sm' className="detailsTitle">My Created Towns</Heading>
                <div>
                    {
                        currentCreatedTowns?.length !== 0 ? (
                            <Table variant='striped' colorScheme='blue'>
                                <TableCaption placement="bottom">User Created Towns</TableCaption>
                                    <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Town Password</Th><Th>Public/Private</Th><Th>Activity</Th></Tr></Thead>
                                    <Tbody>
                                        {currentCreatedTowns?.map((town) => (
                                        <Tr key={town.coveyTownId}><Td role='cell'>{town.friendlyName}</Td><Td
                                            role='cell'>{town.coveyTownId}</Td>
                                            <Td role='cell'>{town.townUpdatePassword}
                                            </Td>
                                            {renderPublicOrNot(town.isPublic)}
                                            <Td role='cell'>
                                                <Button onClick={() => deleteConfirm(town.coveyTownId, town.townUpdatePassword)}>Delete</Button></Td>
                                        </Tr>
                                        ))}
                                    </Tbody>
                            </Table>
                        ):(
                            <Heading as='h5' size='sm' className="detailsTitle">You haven&apos;t created any town.</Heading>
                        )
                    }
                </div>
                {/* <Table variant='striped' colorScheme='blue'>
                    <TableCaption placement="bottom">User Created Towns</TableCaption>
                        <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Town Password</Th><Th>Public/Private</Th><Th>Activity</Th></Tr></Thead>
                        <Tbody>
                            {currentCreatedTowns?.map((town) => (
                            <Tr key={town.coveyTownId}><Td role='cell'>{town.friendlyName}</Td><Td
                                role='cell'>{town.coveyTownId}</Td>
                                <Td role='cell'>{town.townUpdatePassword}
                                </Td>
                                {renderPublicOrNot(town.isPublic)}
                                <Td role='cell'>
                                    <Button onClick={() => deleteConfirm(town.coveyTownId, town.townUpdatePassword)}>Delete</Button></Td>
                            </Tr>
                            ))}
                        </Tbody>
                </Table> */}
                <Heading as='h5' size='sm' className="detailsTitle">My Last Visited Town</Heading>
                <div>
                   {
                    lastVisitedTown? (
                    <Table variant='striped' colorScheme='blue'>
                        <TableCaption placement="bottom">User Last Visited Towns</TableCaption>
                            <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Public/Private</Th></Tr></Thead>
                            <Tbody>
                                <Tr key={lastVisitedTown.coveyTownId}><Td role='cell'>{lastVisitedTown.friendlyName}</Td><Td
                                    role='cell'>{lastVisitedTown.coveyTownId}</Td>
                                    {renderPublicOrNot(lastVisitedTown.isPublic)}
                                </Tr>
                            </Tbody>
                    </Table>
                    ) : (
                        <Heading as='h5' size='sm' className="detailsTitle">You haven&apos;t visited any town.</Heading>
                    )
                   }
                </div>       
            </Box>
         )   
}

