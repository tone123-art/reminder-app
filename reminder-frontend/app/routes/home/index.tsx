import type { Route } from "../../+types/root";
import { Welcome } from "../../welcome/welcome";
import ToDoForm from "../components/ToDoForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reminder-App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <>

  <ToDoForm />
  
  
   </>;
}
