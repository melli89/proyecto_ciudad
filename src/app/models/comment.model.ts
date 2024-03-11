export class CommentModel{

    constructor(
        public id_usuario: string,
        public id_sitio: string,
        public nombre: string,
        public apellidos: string,
        public puntuacion: number,
        public comentario: string,
        public id?: string,
    ){}
}