import React, {useEffect, useState} from 'react';
import {Feather} from '@expo/vector-icons';
import { View, FlatList, Image, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import styles from './styles';



export default function Incidents(){

    const [incidents, setInsidents] = useState([]);
    const [total, setTotal] = useState(0);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
   

    function navigateToDetail(incident){
        navigation.navigate('Detail', {incident});
    }

    async function loadIncidents(){
        if(loading){
            return ;
        }

        if(total > 0 && incidents.length === total){
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params:{page}
        });


        setInsidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
        
    }

   useEffect(() => {
       loadIncidents();
   }, []);
    return (
        <View style = {styles.container}>
            <View style={styles.header}>
                <Image source={logoImg}/>
                    <Text style={styles.headerText}>
                        Total de  <Text styles={styles.headerTextBold}/> {total} casos.
                    </Text>
            </View>

                <Text style={styles.title}>Bem-vindo</Text>
                <Text style={styles.description}>Escolha um dos caso abaixo e salve o dia.</Text>
              
            <FlatList 
                data={incidents}
                style={styles.incident}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item: incident})=> (
                    <View style={styles.incident}>
                    <Text sytle={styles.incidentProperty}>ONG: </Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>
                        
                        <Text sytle={styles.incidentProperty}>CASO: </Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>
                        
                        <Text sytle={styles.incidentProperty}>Valor: </Text>
                        <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', 
                                {style: 'currency', currency: 'BRL'}).format(incident.value)}</Text>

                        <TouchableOpacity 
                            style={styles.detailButton} 
                            onPress={() => navigateToDetail(incident)} 
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name = "arrow-right" size={16} color='#e02041'/>
                        </TouchableOpacity>                   
                </View>  
                )}
            />
        </View>
    );
}