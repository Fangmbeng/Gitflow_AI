// lib/utils/downloadHelpers.ts
export const downloadFile = async (
    architectureData: any, 
    downloadType: 'single' | 'zip', 
    fileType?: 'diagram' | 'documentation' | 'risk'
  ) => {
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          architectureData,
          downloadType,
          fileType
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
  
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'download';
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };
  
  