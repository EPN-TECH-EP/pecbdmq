export class DescargaArchivoUtil{
  public static descargarArchivo(archivo: File) {
    const blob = new Blob([archivo], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = archivo.name;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
