import Movement from '../models/Movement.js';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs'; 

export const getMovements = async (req, res) => {
    try {
        const movements = await Movement.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener movimientos" });
    }
};

export const exportMovements = async (req, res) => {
    try {
        const { range } = req.query; 
        let startDate;

        if (range === 'weekly') {
            startDate = dayjs().subtract(7, 'day').startOf('day');
        } else if (range === 'monthly') {
            startDate = dayjs().subtract(1, 'month').startOf('day');
        } else {
            return res.status(400).json({ message: "Rango de fecha no válido" });
        }

        const movements = await Movement.find({
            user: req.user.id,
            createdAt: { $gte: startDate.toDate() }
        }).sort({ createdAt: -1 });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Gestión de Stock';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet(`Movimientos_${range}`);

        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 20 },
            { header: 'Producto', key: 'product', width: 30 },
            { header: 'Tipo', key: 'type', width: 15 },
            { header: 'Talle', key: 'size', width: 10 },
            { header: 'Cantidad', key: 'quantity', width: 10 },
        ];

        worksheet.getRow(1).font = { bold: true };

        movements.forEach(mov => {
            worksheet.addRow({
                date: dayjs(mov.createdAt).format('DD/MM/YYYY HH:mm'),
                product: mov.productName,
                type: mov.type.charAt(0).toUpperCase() + mov.type.slice(1),
                size: mov.size,
                quantity: mov.quantityChange,
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=reporte_movimientos_${range}_${dayjs().format('YYYY-MM-DD')}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ message: "Error al exportar movimientos" });
    }
};
export const deleteMovements = async (req, res) => {
    try {
        const result = await Movement.deleteMany({ user: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No se encontraron movimientos para eliminar." });
        }

        res.status(200).json({ message: "Historial de movimientos eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el historial", error: error.message });
    }
};