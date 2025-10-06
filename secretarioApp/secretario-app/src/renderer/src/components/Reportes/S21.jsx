import { useEffect, useState } from 'react'
import Alert from './../utils/Alert'

const fetchPublicadores = async () => await window.api.invoke('get-publicadores')
const fetchInformes = async (anio_servicio, id_publicador) => await window.api.invoke('get-informes', [anio_servicio, id_publicador, ''])
const MONTHS = [
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto'
]

const S21 = () => {
    const initialYear = (new Date().getMonth() > 8 ? 1 : 0) + new Date().getFullYear()
    const [pubId, setPubId] = useState(0)
    const [publicadores, setPublicadores] = useState([])
    const [informes, setInformes] = useState([])
    const [year, setYear] = useState(initialYear)
    const [nombreInput, setNombreInput] = useState('')
    const [showOptions, setShowOptions] = useState(false)
	const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        window.api.receive('save-S-21-reply', () => setShowAlert(true))
        cargarPublicadores()
    }, [])

    useEffect(() => {
        cargarInformes()
    }, [year, pubId])

    // Cargar publicadores desde la base de datos
    const cargarPublicadores = async () => {
        const { success, data } = await fetchPublicadores()
        setPublicadores(success ? data : [])
    }
    // Cargar informes desde la base de datos
    const cargarInformes = async () => {
        if (year && pubId) {
            const { success, data } = await fetchInformes(year, pubId)
            setInformes(success ? data : [])
        }
        else
            setInformes([])
    }

    return (
        <div className="max-w-5xl mx-auto bg-white shadow-2xl border border-gray-300 rounded-lg p-8 mt-10">
            {/* Encabezado */}
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-2xl font-bold tracking-wide mb-1 text-center">
                    REGISTRO DE PUBLICADOR DE LA CONGREGACIÓN
                </h1>
            </div>

            <Alert
                type="success"
                message="Archivo(s) creado(s) con éxito!"
                show={showAlert}
                onCancel={() => setShowAlert(false)}
            />
            {/* Datos personales */}
            <div className="grid grid-cols-4 gap-4 mb-2">
                <div className="col-span-4 flex flex-row gap-4 items-center relative">
                    <span className="font-semibold">Nombre:</span>
                    <input
                        type="text"
                        className="border-b border-gray-400 px-2 bg-white focus:outline-none w-100"
                        value={nombreInput}
                        onChange={(e) => {
                            setNombreInput(e.target.value)
                            setShowOptions(true)
                        }}
                        onFocus={() => setShowOptions(true)}
                        placeholder="Buscar publicador..."
                    />
                    {showOptions && nombreInput.length > 0 && (
                        <ul className="absolute top-10 left-32 bg-white border border-gray-300 rounded shadow-lg z-10 w-64 max-h-60 overflow-y-auto">
                            {publicadores
                                .filter((pub) => (`${pub.nombre} ${pub.apellidos}`.toLowerCase().includes(nombreInput.toLowerCase())))
                                .map((pub) => (
                                    <li key={pub.id} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onMouseDown={() => {
                                        setPubId(pub.id)
                                        setNombreInput(`${pub.nombre} ${pub.apellidos}`)
                                        setShowOptions(false)
                                    }}>
                                        {pub.nombre} {pub.apellidos}
                                    </li>
                                ))}
                            {publicadores.filter((pub) => (`${pub.nombre} ${pub.apellidos}`.toLowerCase().includes(nombreInput.toLowerCase()))).length === 0 && (
                                <li className="px-3 py-2 text-gray-400">Sin resultados</li>
                            )}
                        </ul>
                    )}
                </div>
                <DatosPublicador pubId={pubId} publicadores={publicadores} />
            </div>

            {/* Privilegios */}
            <PrivilegiosPublicador pubId={pubId} publicadores={publicadores} />

            {/* Tabla de registros mensuales */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-400 text-xs">
                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="border px-2 py-1 w-40">Año de servicio<br />
                                <select onChange={(e) => setYear(Number(e.target.value))} value={year}>
                                    {[initialYear - 2, initialYear - 1, initialYear, initialYear + 1].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="border px-2 py-1 w-20">Participación en el ministerio</th>
                            <th className="border px-2 py-1 w-20">Cursos bíblicos</th>
                            <th className="border px-2 py-1 w-20">Precursor auxiliar</th>
                            <th className="border px-2 py-1 w-20">Horas</th>
                            <th className="border px-2 py-1">Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MONTHS.map((month, index) => {
                            const informe = informes.find((item) => item.iNumMes === index + 1)
                            return (
                                <tr key={index} className="text-center">
                                    <td className="border px-2 py-1 font-semibold text-left">{month}</td>
                                    <td className="border px-2 py-1"><input type="checkbox" checked={informe && informe.predico_en_el_mes} readOnly /></td>
                                    <td className="border px-2 py-1">{informe && informe.cursos_biblicos}</td>
                                    <td className="border px-2 py-1"><input type="checkbox" checked={informe && informe.tipo_publicador === 'Precursor auxiliar'} readOnly /></td>
                                    <td className="border px-2 py-1">{informe && informe.horas}</td>
                                    <td className="border px-2 py-1 text-left">{informe && informe.notas}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Total de horas */}
            <div className="flex justify-end mt-2">
                <span className="font-semibold">Total de horas: {informes.reduce((acc, r) => acc + r.horas, 0)}</span>
            </div>
            <div className="flex justify-end mt-2">
                {year && pubId != 0 && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600"
                        onClick={() => window.api.send('save-S-21', [year, pubId])}
                    >Exportar a PDF</button>
                )}
                {year && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600"
                        onClick={() => window.api.send('save-S-21', [year, null])}
                    >Exportar todos</button>
                )}
            </div>
        </div>
    )
}
function DatosPublicador({ pubId, publicadores }) {
    const pub = publicadores.find((item) => item.id === pubId)
    if (pub)
        return (
            <>
                <div className="col-span-2 flex flex-row gap-2 items-center">
                    <span className="font-semibold">Fecha de nacimiento:</span>
                    <span className="border-b border-gray-400 px-2">{pub.fecha_nacimiento}</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.sexo == "H"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Hombre</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.sexo == "M"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Mujer</label>
                </div>
                <div className="col-span-2 flex flex-row gap-2 items-center">
                    <span className="font-semibold">Fecha de bautismo:</span>
                    <span className="border-b border-gray-400 px-2">{pub.fecha_bautismo}</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={!pub.ungido} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Otras ovejas</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.ungido} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Ungido</label>
                </div>
            </>
        );
}
function PrivilegiosPublicador({ pubId, publicadores }) {
    const pub = publicadores.find((item) => item.id === pubId)
    if (pub)
        return (
            <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.privilegio === "Anciano"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Anciano</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.privilegio === "Siervo ministerial"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Siervo ministerial</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.tipo_publicador === "Precursor regular"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Precursor regular</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.tipo_publicador === "Precursor especial"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Precursor especial</label>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <input type="checkbox" checked={pub.tipo_publicador === "Misionero que sirve en el campo"} readOnly className="accent-blue-600" />
                    <label className="font-semibold">Misionero que sirve en el campo</label>
                </div>
            </div>);
}
export default S21;