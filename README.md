# programmers-cookie-jwt

Cookie와 JWT를 설정하여 respond 한 실습 코드입니다.  

전체 프로젝트에 대한 코드는 저작권으로 인해 private Repository에 저장하였습니다.


---

# programmers app.js - 2024.05.21 

Book-Shop 프로젝트의 코드 중 app.js에 대한 제출용 코드입니다.
다른 API들에 대한 코드는 private Repository에 저장하였습니다.

---
# programmers BookController.js - 2024.05.24

Book-Shop 프로젝트의 BookController.js 코드 중, 도서 목록 조회 페이징 구현 제출용 코드입니다.
Path Parameter로 limits와 pages 값을 전달 받아, SQL의 LIMIT - OFFSET 구문을 이용하였습니다.

다른 API들에 대한 코드는 private Repository에 저장하였습니다.

---
# programmers BookControllerLikes.js - 2024.05.27

Book-Shop 프로젝트의 BookController.js 코드 중, 서브쿼리와 count()를 이용하여 책마다의 `좋아요` 개수와, user가 좋아요를 했는지의 여부를 respond 해주는 코드입니다.

---
# programmers CartsController.js - 2024.05.28

Book-Shop 프로젝트에서 장바구니 API를 구현한 코드입니다.

장바구니 데이터베이스는 `cart_id`, `book_id`, `user_id`, `quantity`로 구성하여 
모든 사용자의 장바구니를 하나의 테이블에 저장하였습니다.

- 장바구니 추가
request에서 jwt의 userId를 읽어오고, bookId가 request 되면 해당 사용자의 장바구니에 추가되도록 구현하였습니다.

- 장바구니 조회
request에서 jwt의 userId를 읽어오고, 해당 사용자의 장바구니 목록을 respond 해주도록 구현하였습니다.

- 장바구니 삭제
request에서 jwt의 userId를 읽어오고, 해당 사용자가 선택한 장바구니 항목을 삭제하도록 구현하였습니다.

- 장바구니에서 선택된 항목들 조회
request에서 jwt의 userId를 읽어오고, 사용자가 장바구니 목록 중 선택한 항목들을 조회하도록 구현하였습니다.


 
