"use server"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {cookies} from 'next/headers'


export async function login(formData){
    const supabase = createClient();

    const data = {
        email: formData.get('email'), 
        password: formData.get('password'),
    }

    const {error, user} = await supabase.auth.signInWithPassword(data);

    console.log("user retrieved: ", user);

    if (error){
        console.log(error);
        redirect('/error')
    }
    const cookieStore = cookies();
    if (cookieStore.get('access') == null){
        redirect("/login")
    }
    else redirect("/");
}

export async function signup(formData){
    const supabase = createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }
    
    
      const { error } = await supabase.auth.signUp(data)
    
      if (error) {
        console.log(error)
        redirect('/error')
      }
    
    redirect('/signup');
}

export async function getSupaUser(){
    const supabase = createClient();

    const data = await supabase.auth.getUser()
    console.log("get supa user: ", data)
    if (data.data.user == null){
        return null;
    } else {return data.data.user;}
}
    
