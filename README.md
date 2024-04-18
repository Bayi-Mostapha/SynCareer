# SynCareer

a recruitment platform built with laravel on backend and react on frontend

demo video: https://youtu.be/wBSVLTLLiO8

## Project setup

### backend:
open the project folder in a terminal, go to backend and run `composer install` then `php artisan migrate` then `php artisan serve` then `php artisan websockets:serve`

### frontend:
open the project folder in a terminal, go to frontend and run `npm install` then `npm run dev`

## video call setup
1- after you run `npm install` go to node_modules/randombytes/browser.js and change all instaces of global to window
(search for global `ctrl+f` put the cursor and click on `ctrl+d` and change global to window)

2- remove this folder, you will find it inside node_modules: ".vite"

3- run  `npm run dev`

## admin
go to your database manager and open the admins table, insert a super admin using this querry: 

`INSERT INTO admins (first_name, last_name, email, password, role) 
VALUES ('John', 'Doe', 'john.doe@example.com', '$2y$12$YkGHWWFGjUK8X5z71ls0buS5EopgVkkqzRatuehuYfGhSVknlNBXW', 's');`

the password is: 11111111

## project preview (main functionalities) :
### login
![WhatsApp Image 2024-04-05 at 04 47 58](https://github.com/Bayi-Mostapha/SynCareer/assets/133959392/605ab905-1676-4224-8ae0-0e1d69fe4ac6)

### home
![WhatsApp Image 2024-04-04 at 11 34 33 (2)](https://github.com/Bayi-Mostapha/SynCareer/assets/133959392/f8d3c62b-4d1d-47df-b325-15c6375e26db)

### resume builder
![WhatsApp Image 2024-04-04 at 11 34 33 (1)](https://github.com/Bayi-Mostapha/SynCareer/assets/133959392/1179c84e-6411-4406-9876-ad08ebf27c6c)

### video call
![WhatsApp Image 2024-04-04 at 11 34 33](https://github.com/Bayi-Mostapha/SynCareer/assets/133959392/2708a0d8-b702-48de-8e89-51edc97e97dc)

### real time chat
![WhatsApp Image 2024-04-13 at 13 26 27](https://github.com/Bayi-Mostapha/SynCareer/assets/133959392/d26c22fd-1677-467e-8ff8-68d856f74d03)

