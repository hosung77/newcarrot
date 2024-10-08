from fastapi import FastAPI,UploadFile,Form,Response,Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from typing import Annotated
import sqlite3



con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

app = FastAPI()


SERCRET = "super-cording"
manager = LoginManager(SERCRET, '/login')

@manager.user_loader()
def query_user(data):
    WHERE_STATEMENTS = f'id="{data}"'  #65강
    if type(data) == dict:
        WHERE_STATEMENTS = f'''id="{data['id']}"'''
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    user = cur.execute(f"""
                       SELECT * from users WHERE {WHERE_STATEMENTS}
                       """).fetchone()

    return user


@app.post('/login')
def login(id:Annotated[str,Form()], 
           password:Annotated[str,Form()]):
    user = query_user(id) #id를 이용해 query_user 함수를 호출하여 데이터베이스에서 해당 사용자를 찾습니다.
    if not user:
        raise InvalidCredentialsException #401을 자동으로 생성해서 내려줌
    elif password != user['password']:
       raise InvalidCredentialsException
   
    access_token = manager.create_access_token(data={
       'sub': {
        'id':user['id'],
       'name':user['name'],
       'email':user['email']
       
       }
       
   })
    
    return {'access_token':access_token} 



@app.post('/signup')
def signup(id:Annotated[str,Form()], 
           password:Annotated[str,Form()],
           name:Annotated[str, Form()],
           email:Annotated[str, Form()]):
    cur.execute(f"""
                INSERT INTO users(id,name,email,password)
                VALUES ('{id}', '{name}', '{email}', '{password}')
                """)
    con.commit()
    return '200'                #이렇게 짜면 이미 가입되어 있는 유저도 가입 가능

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
async def get_items(user=Depends(manager)): #65강 수정부분, 서버에서 유저가 인증상태에서만 응답을
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



