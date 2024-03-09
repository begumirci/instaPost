import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import './App.css'
import img from './assets/Adsız.png';
import { Outlet, useNavigate } from 'react-router-dom';
import './form.css';
import eye from './assets/eye.svg';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import anon from './assets/anon.jpg';


const url = 'https://upalzegnwdofjolnznpq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYWx6ZWdud2RvZmpvbG56bnBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDAzODY0NSwiZXhwIjoyMDE1NjE0NjQ1fQ.Tkc0V4RTC-pwpYdE1lIM08hhX7UC6Cm0Yc0s0LJC3Js';

const supabase = createClient(url, key);

export function Login(){

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  function handlePassword() {
    if (showPassword == false) {
      setShowPassword(true);
    }
    if (showPassword == true) {
      setShowPassword(false)
    }
  }

  async function handleLogin(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData);

    console.log(user);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })
    if(error){
      alert('Böyle bir kullanıcı bulunmuyor');
    }else{
      alert('Kullanıcı başarıyla giriş yaptı');
      navigate('/');
    }
  }

  return(
    <div className='container'>
      <h1>Giriş Yap</h1>
      <form className='login-form' onSubmit={handleLogin}>
        <div className="input-element">
          <input type="email" name='email' required />
          <label>Email</label>
        </div>
        <div className="input-element">
          <input type={showPassword ? 'text' : 'password'} name='password' required />
          <label>Şifre</label>
          <img className='eye' src={eye} alt="" onClick={handlePassword} />
        </div>
        <div className='buttons'>
          <button className='btn'>Giriş Yap</button>
          <button className='btn' onClick={() => { navigate(-1) }}>Geri</button>
        </div>
      </form>

    </div>
  )
}

export function Register(){
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handlePassword() {
    if (showPassword == false) {
      setShowPassword(true);
    }
    if (showPassword == true) {
      setShowPassword(false)
    }
  }

  async function handleRegister(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const newuser = Object.fromEntries(formData);

      
    const { data, error } = await supabase.auth.signUp({
      email: newuser.email,
      password: newuser.password,
      options: {
        data:{
          name: newuser.name,
          image: newuser.image.name
        }
      }
    })
    if (error) {
      alert('Lütfen e-posta veya şifrenizi kontrol edin');
    } else { 
      alert('Kayıt Başarılı');
      navigate('/');
    }
    
    const { data: imgData, error: imgError } = await supabase
      .storage
      .from('profiles')
      .upload(`${data.user.id}.jpeg`, newuser.image)
  }

  return(
    <div className='container'>
      <h1>Üye Ol</h1>
      <form className='login-form' onSubmit={handleRegister}>
        <div className="input-element">
          <input type="text" name='name' required />
          <label>Ad</label>
        </div>
        <div className="input-element">
          <input type="email" name='email' required />
          <label>Email</label>
        </div>
        <div className="input-element relative">
          <input type={showPassword ? 'text' : 'password'} name='password' required />
          <label>Password</label>
          <img className='eye' src={eye} alt="" onClick={handlePassword} />
        </div>
        <div className="input-element">
          <input type="file" name='image' />
        </div>
        <div className='buttons'>
          <button className='btn'>Üye Ol</button>
          <button className='btn' type='button' onClick={() => navigate(-1)}>Geri</button>
        </div>
      </form>
    </div>
  )
}

async function Logout(){
 
  const { error } = await supabase.auth.signOut();
 

}

export function User(){
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    supabase.auth.onAuthStateChange((event,session) => {
      setUser(session?.user);
    })
  },[]) 
 
  return (
    <div>
      {user ?
       <>
      <div className='profile'>
        <div className='profile-header'>
              {user?.user_metadata?.image === '' ? <img src={`https://upalzegnwdofjolnznpq.supabase.co/storage/v1/object/public/profiles/anon.jpg`} alt="" />
               : <img src={`https://upalzegnwdofjolnznpq.supabase.co/storage/v1/object/public/profiles/${user.id}.jpeg`} alt="" />}
            {/* <img src={`https://upalzegnwdofjolnznpq.supabase.co/storage/v1/object/public/profiles/${user.id}.jpeg`} alt="" />  */}
            <h4>{user.user_metadata?.name}</h4>
        </div>
        <button className='btn' onClick={() => Logout()}>Çık</button> 
        </div>
       <div className='container'>
        <SendPost user={user} />
        </div> 
      </> :
      <>
      <div className='buttons'>
          <Link to='/register'><button className='btn'>Kayıt Ol</button></Link>
          <Link to='/login'><button className='btn'>Giriş Yap</button></Link>
          </div>
      </>
      }
    </div>
  )
}

function SendPost({user}){
const [post, setPost] = useState([]);
const [comment, setComment] = useState([]);

useEffect(() => {
  async function getComments(){

    let { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      setComment(comments);
  }
  async function getPosts() {
    const { data: posts, error: postError } = await supabase
      .from('posts')
      .select('*')
    setPost(posts);
  }
  getPosts();
  getComments();
},[])

async function handlePost(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const myPost = Object.fromEntries(formData);
    
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { caption: myPost.post, username: user.user_metadata.name },
      ]).
      select();
      
    console.log(data);
    const { data:imgData, error:imgError } = await supabase
      .storage
      .from('posts')
      .upload(`${data[0].id}.jpeg`, myPost.image);
  }
  
     
  return(
    <div>
      
      <form onSubmit={handlePost} className='post-form' encType="multipart/form-data">
        <div className='post-input'>
          <input type="file" name="image" accept='image/jpeg' />
          <div className='input-element'>
            <input type="text" name='post' required />
            <label>Açıklama</label>
          </div>
        </div>
        <button className='btn'>Ekle</button>
      </form>
      <Posts post={post} user={user} comment={comment} />
    </div>
  )
}

function Posts({post,user, comment}){

  async function delComment(postId){
    

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', postId)
      if(error){
        console.log(error)
      }else{
        console.log('basarı');
      }


  }
  
  return(
    <div className='container'>
      <div className='posts'>
        {
          post.map(x => (
            <div className='post' key={x.id}>
              <div className='user'>
                <img src={`https://upalzegnwdofjolnznpq.supabase.co/storage/v1/object/public/profiles/${x.user_id}.jpeg`} alt="" />
                <h4>{x.username}</h4>
              </div>
              <div className='content'>
                <img src={`https://upalzegnwdofjolnznpq.supabase.co/storage/v1/object/public/posts/${x.id}.jpeg`} alt={x.caption} />
                <div><strong>{x.username} </strong>{x.caption}</div>
              </div>
              <div className='commtents'>
                {comment.map(z => (z.post_id == x.id) && <div key={z.id} className='comment'>
                  <div className='comment-header'> 
                    <img className='comment-img' src={`https://upalzegnwdofjolnznpq.supabase.co/storage/v1/object/public/profiles/${z.user_id}.jpeg`} alt="" />
                    <p><strong>{z.username}</strong> {z.comment}</p>
                  </div>
                  <button className="del-button" onClick={() => delComment(z.id)}>
                    <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                  </button>
                </div>)
                }
              </div>
              <SendComment post={post} x={x.id} user={user} />
              
            </div>
          ))
        }
      </div>
    </div>
  )
}

function SendComment({x,user}){
  
  async function handleComment(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = Object.fromEntries(formData);

    const { data, error } = await supabase
      .from('comments')
      .insert([
        { comment: comment.comment , post_id:x, username: user.user_metadata.name },
      ])
      .select()

      e.target.reset();
  }


  return(
    <div>
     <form onSubmit={handleComment} className='comment-form'>
      <input type="text" placeholder='yorum yap' name='comment' />
      <button className='btn'>Gönder</button>
     </form>
    </div>
  )
}

function App() {
  
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
