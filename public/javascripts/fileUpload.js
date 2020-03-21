FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize
)

FilePond.setOptions({
    maxFileSize: '10MB'
})

FilePond.parse(document.body)