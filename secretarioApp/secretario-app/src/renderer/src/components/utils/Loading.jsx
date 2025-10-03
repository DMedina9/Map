import logo from './../../assets/logo.png' // Cambia la ruta por la imagen que desees

const Loading = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white opacity-80 z-[9999] w-screen h-screen">
        <div className="text-center">
            <img src={logo} alt="Cargando..." className="w-20 h-20 mx-auto" />
            <div className="mt-4 text-lg text-gray-800">Cargando...</div>
        </div>
    </div>
);

export default Loading;
