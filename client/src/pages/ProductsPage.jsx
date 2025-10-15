import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { Link } from "react-router-dom";

function ProductsPage() {
    const { products, getProducts, deleteProduct, registerSale } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [sortOrder, setSortOrder] = useState('desc'); 

    useEffect(() => {
        getProducts();
    }, []);

    const displayedProducts = products
        .filter(product => {
            if (categoryFilter === 'Todas') {
                return true;
            }
            return product.category === categoryFilter;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (sortOrder === 'asc') {
                return dateA - dateB; 
            }
            return dateB - dateA; 
        });
    
    const categories = ['Todas', ...new Set(products.map(p => p.category))];
    const closeModal = () => setSelectedProduct(null);

    if (products.length === 0) return <h1>No hay productos. <Link to="/add-product" className="form-link">Crea uno nuevo</Link>.</h1>;

    return (
        <div>
            <div className="filters-wrapper">
                <div className="filter-container">
                    <label htmlFor="category-filter">Filtrar por Marca:</label>
                    <select 
                        id="category-filter" 
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-container">
                    <label htmlFor="sort-order">Ordenar por Fecha:</label>
                    <select
                        id="sort-order"
                        className="filter-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">Más Recientes</option>
                        <option value="asc">Más Antiguos</option>
                    </select>
                </div>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th className="text-center">Nombre</th>
                            <th className="text-center">Marca / Categoría</th>
                            <th className="text-center">Color</th>
                            <th className="text-center">Fecha de Carga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.map(product => (
                            <tr key={product._id} onClick={() => setSelectedProduct(product)}>
                                <td data-label="Nombre" className="text-center">{product.name}</td>
                                <td data-label="Marca" className="text-center">
                                    <span className="category-badge">{product.category}</span>
                                </td>
                                <td data-label="Color" className="text-center">{product.color}</td>
                                <td data-label="Fecha de Carga" className="text-center">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedProduct.name}</h2>
                            <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Precio: ${selectedProduct.price}</p>
                        </div>
                        <div className="modal-body">
                            <h3 style={{fontWeight: 'bold'}}>Stock y Ventas:</h3>
                            <ul className="modal-list">
                                {selectedProduct.sizes.map(s => (
                                    <li key={s.size}>
                                        <span>Talle {s.size}: {s.quantity} unidades</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                registerSale(selectedProduct._id, s.size);
                                                const updatedProduct = {
                                                    ...selectedProduct,
                                                    sizes: selectedProduct.sizes.map(size =>
                                                        size.size === s.size
                                                            ? { ...size, quantity: size.quantity - 1 }
                                                            : size
                                                    )
                                                };
                                                setSelectedProduct(updatedProduct);
                                            }}
                                            disabled={s.quantity === 0}
                                            className="btn btn-danger"
                                        >
                                            Vender
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <Link to={`/products/${selectedProduct._id}`} className="btn btn-success">Editar</Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProduct(selectedProduct._id);
                                    closeModal();
                                }}
                                className="btn btn-danger"
                            >
                                Eliminar
                            </button>
                            <button onClick={closeModal} className="btn btn-success">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsPage;