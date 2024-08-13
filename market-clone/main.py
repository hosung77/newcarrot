from fastapi import FastAPI,UploadFile,Form,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

app = FastAPI()

con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

@app.post('/items')
async def create_item(image:UploadFile, 
                title:Annotated[str, Form()], 
                price:Annotated[int, Form()],
                description:Annotated[str, Form()], 
                place:Annotated[str, Form()],
                insertAt:Annotated[int, Form()]
                ):
                
    
    image_bytes = await image.read() #이미지는 용량이 커서 읽는 과정을 await
    cur.execute(f"""
                INSERT INTO items(title,image,price,description,place,insertAt)
                VALUES ('{title}','{image_bytes.hex()}','{price}','{description}','{place}',{insertAt})
                """)  #image_bytes hex로 바꿔서 16진법으로 바꿈. 데이터를 짧게 표시하기 위해서
    
    con.commit()
    return '200'

@app.get('/items')
async def get_items():
    con.row_factory = sqlite3.Row  #컬렴명도 같이 불러오는 문법
    cur = con.cursor()  #위치를 업데이트 하기 위해
    rows = cur.execute(f"""
                       SELECT * from items
                       """).fetchall()

    return JSONResponse(jsonable_encoder(dict(row)for row in rows))  
    
#{id:1, title:'식칼팝니다'}

@app.get("/images/{item_id}")
async def get_image(item_id):
    cur = con.cursor()
    # 16진법
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id={item_id}
                              """).fetchone()[0]
    
    return Response(content=bytes.fromhex(image_bytes)) #16진법으로 된 것을 byte 코드로 해서 content를 reponse 하겠다.
    



app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend") 
#루트 패스는 맨 마지막에 작성


