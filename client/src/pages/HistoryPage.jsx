import { useEffect, useState } from 'react';
import { getMovementsRequest, deleteMovementsRequest } from '../api/movements';

function HistoryPage() {
    const [movements, setMovements] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    
    const fetchMovements = async () => {
        try {
            const res = await getMovementsRequest();
            setMovements(res.data);
        } catch (error) {
            console.error("Error al obtener movimientos:", error);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    const handleDeleteHistory = async () => {
        try {
            await deleteMovementsRequest();
            setMovements([]); 
            setShowConfirmModal(false); 
        } catch (error) {
            console.error("Error al eliminar el historial:", error);
            setShowConfirmModal(false);
        }
    };

    const backendUrl = 'http://localhost:4000/api';

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Historial de Movimientos</h1>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href={`${backendUrl}/movements/export?range=weekly`} className="btn btn-success">
                        Descargar Semanal
                    </a>
                    <a href={`${backendUrl}/movements/export?range=monthly`} className="btn btn-success">
                        Descargar Mensual
                    </a>
                 
                    <button onClick={() => setShowConfirmModal(true)} className="btn btn-danger">
                        Vaciar Historial
                    </button>
                </div>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th className="text-center">Fecha</th>
                            <th className="text-center">Producto</th>
                            <th className="text-center">Tipo</th>
                            <th className="text-center">Talle</th>
                            <th className="text-center">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.length > 0 ? (
                            movements.map(mov => (
                                <tr key={mov._id}>
                                    <td data-label="Fecha" className="text-center">{new Date(mov.createdAt).toLocaleString()}</td>
                                    <td data-label="Producto" className="text-center">{mov.productName}</td>
                                    <td data-label="Tipo" className="text-center">
                                        <span className={
                                            mov.type === 'venta' ? 'badge-danger' :
                                            mov.type === 'creacion' ? 'badge-success' :
                                            'badge-warning'
                                        }>
                                            {mov.type}
                                        </span>
                                    </td>
                                    <td data-label="Talle" className="text-center">{mov.size}</td>
                                    <td data-label="Cantidad" className="text-center" style={{ color: mov.quantityChange >= 0 ? 'var(--color-green)' : 'var(--color-red)', fontWeight: 'bold' }}>
                                        {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay movimientos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Confirmar Eliminación</h2>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <p>¿Estás seguro de que quieres eliminar todo el historial de movimientos? <br/>Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary" style={{ width: 'auto', marginTop: 0 }}>
                                Cancelar
                            </button>
                            <button onClick={handleDeleteHistory} className="btn btn-danger" style={{ width: 'auto', marginTop: 0 }}>
                                Sí, eliminar todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistoryPage;