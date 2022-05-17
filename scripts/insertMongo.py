#necessita di pymongo (pip install pymongo) e pymongo[srv] (pip install pymongo[srv])
import pymongo
from datetime import datetime
 
'''
questo script si occupa di inserire all'interno di un database mongoDB dei documenti nella collezione prenotaziones
per tutte le 24 ore del giorno selezionato, ad intervalli di 15 minuti
'''


#inserisci il link al database
myclient = pymongo.MongoClient()
mydb = myclient["torneo"]
mycol = mydb["prenotaziones"]
result= mycol.delete_many({})

for j in range(1,24):
    for i in range(0,60,15):
    
        mins=str(i)
        hours=str(j) 
        if(i<10):
            mins='0'+str(i)
        
        if(j<10):
            hours='0'+str(j)
        dt_obj = datetime.strptime('16.05.2022 '+ hours +':'+ mins+':00,00','%d.%m.%Y %H:%M:%S,%f')
        print(dt_obj)
        millisec = dt_obj.timestamp() * 1000
        mydict = { "prenotatore": "", "sede": "Povo1", "giorno":dt_obj }

        x = mycol.insert_one(mydict)