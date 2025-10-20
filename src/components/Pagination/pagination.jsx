// ============================================
// COMPONENTE DE PAGINACIÓN REUTILIZABLE
// ============================================
const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    showItemsPerPage = true,
    onItemsPerPageChange 
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calcular rango de páginas a mostrar
    const getPageNumbers = () => {
        const delta = 2; // Número de páginas a mostrar a cada lado de la actual
        const range = [];
        const rangeWithDots = [];
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }
        
        let prev = 0;
        for (const i of range) {
            if (prev + 1 !== i) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }
        
        return rangeWithDots;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-600/30">
            {/* Información de items */}
            <div className="text-sm text-gray-400">
                Mostrando <span className="font-semibold text-white">{startItem}</span> a{' '}
                <span className="font-semibold text-white">{endItem}</span> de{' '}
                <span className="font-semibold text-white">{totalItems}</span> resultados
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 1
                            ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                    ← Anterior
                </button>

                {/* Números de página */}
                <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((pageNum, idx) => (
                        pageNum === '...' ? (
                            <span key={`dots-${idx}`} className="px-2 text-gray-500">...</span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    currentPage === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {pageNum}
                            </button>
                        )
                    ))}
                </div>

                {/* Página actual en móvil */}
                <div className="sm:hidden px-4 py-2 bg-gray-700 rounded-lg text-white font-medium">
                    {currentPage} / {totalPages}
                </div>

                {/* Botón siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === totalPages
                            ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                    Siguiente →
                </button>
            </div>

            {/* Selector de items por página */}
            {showItemsPerPage && (
                <div className="flex items-center gap-2">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-400">
                        Por página:
                    </label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                        <option value={24}>24</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Pagination;