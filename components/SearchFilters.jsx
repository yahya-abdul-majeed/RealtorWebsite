import {useEffect, useState} from 'react';
import {Flex, Select, Box, Text, Input,Spinner, Icon, Button} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {MdCancel} from 'react-icons/md';
import Image from 'next/image';
import { filterData, getFilterValues } from '../utils/filterData';
import {fetchApi, baseUrl} from '../utils/fetchApi';


const SearchFilters =()=>{
    const [filters, setFilters] = useState(filterData);
    const [showLocations, setShowLocations] =useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationData, setLocationData] = useState([]);
    const router = useRouter();
    
    const searchProperties = (filterValues) =>{
        const path = router.pathname;
        const {query} =router;

        const values= getFilterValues(filterValues);

        values.forEach((item)=>{
            if(item.value && filterValues?.[item.name]){
                query[item.name]=item.value;
            }
        });
        //console.log("from sp",values);
        //console.log("query",query);

        router.push({pathname:path, query});
    }

    useEffect(()=>{
        if(searchTerm!==''){
            const fetchData= async ()=>{
                const data = await fetchApi(`${baseUrl}/auto-complete?query=${searchTerm}`);
                console.log(data);
                setLocationData(data?.hits);
            }
            fetchData();
        }
    },[searchTerm])

    return(
        <Flex bg='gray.100' p='4' justifyContent='center' flexWrap='wrap'>
            {filters.map((filter)=>(
                <Box key={filter.queryName}>
                    <Select 
                    placeholder={filter.placeholder}
                    w='fit-content'
                    p='2'
                    onChange={(e)=> searchProperties({[filter.queryName]:e.target.value})}>
                    {filter?.items?.map((item)=>(
                        <option value={item.value} key={item.value}>{item.name}</option>
                    ))}
                    </Select>
                </Box>
            ))}
            
            <Flex flexWrap='wrap'>
                <Button 
                    onClick={()=> setShowLocations(!showLocations)}
                    marginTop='8px'
                    marginLeft='50px'
                    colorScheme='blue'>
                    Search Locations
                </Button>
                {showLocations && <Input
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    placeholder='Search Locations'
                    variant='filled'
                    borderColor='black.400'
                    m='20px'
                />}
            </Flex>
            {showLocations && searchTerm && (
                <Box overflow='auto' height='300px'>
                    {locationData?.map((location)=>{
                        return <Box
                        key={location.id}
                        onClick={()=>{searchProperties({ locationExternalIDs: location.externalID });setShowLocations(false);} }
                        >
                            <Text cursor='pointer' bg='gray.200' p='2' borderBottom='1px' borderColor='gray.100' >
                            {location.name}
                            </Text>
                        </Box>
                    })}
                </Box>
            )}
        </Flex>
        
    )
}

export default SearchFilters;