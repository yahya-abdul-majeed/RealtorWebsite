import axios from "axios";

export const baseUrl= 'https://bayut.p.rapidapi.com'

export const fetchApi = async (url)=>{
    const {data} = await axios.get(url, {
        headers: {
            'X-RapidAPI-Key': '74499a5611msh79641180f197249p139d43jsn6976bab7b0a5',
            'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
          }
    })
    return data;
}