import Mapa from '../models/mapaSchema.js';

export const getMapaByRegion = async(req, res) => {
    const { region } = req.query;
    try {
        const nodos = await Mapa.find({ region });
        res.json(nodos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del mapa' });
    }
};