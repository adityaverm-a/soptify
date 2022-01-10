import { getProviders, signIn } from 'next-auth/react'

function login({ providers }) {
    console.log(providers);
    return (
        <div className='bg-black flex flex-col items-center justify-center min-h-screen w-full'>
            <img 
                src="https://i.imgur.com/fPuEa9V.png"  
                className="w-52 mb-8"
                alt="Spotify Logo" 
            />
            {Object.values(providers).map((provider) => (
                <div key={provider.id} >
                    <button
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                        className='bg-[#18D860] text-white text-lg font-semibold p-5 rounded-full '
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default login

export async function getServerSideProps() {
    const providers = await getProviders()

    return {
        props: {
            providers
        }
    }
}
