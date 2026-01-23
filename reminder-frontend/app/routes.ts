import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [

    route('/login',"./routes/login/index.tsx"),

    layout("./routes/layouts/protected.tsx", [  
    layout('./routes/layouts/main.tsx', [ 
    
    index("routes/home/index.tsx"),
    route('calendar', "./routes/calendar/calendar.tsx"),
    route('post/tasks',"./routes/post/tasks/index.tsx"),
    route('post/shopping', "./routes/post/shopping/index.tsx"),
    route('post/books', "./routes/post/books/index.tsx"),
    route('post/movies', "./routes/post/movies/index.tsx"),
    route('tasks',"./routes/lists/tasks/index.tsx"),
    route('shopping', "./routes/lists/shopping/index.tsx"),
    route('books', "./routes/lists/books/index.tsx"),
    route('movies', "./routes/lists/movies/index.tsx"),

    layout('./routes/layouts/admin.tsx', [
        route('admin', "./routes/admin/index.tsx"),
    ]),
    ]),
    ]),
    
    
    
    ] satisfies RouteConfig;
