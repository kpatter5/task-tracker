function confirmDelete()
{
    var result = confirm("Are you sure you want to delete?");
    return result;
}

function confirmDeleteAndUpdateFormAction(formId, selectId)
{
    updateFormAction(formId, selectId);
    return confirmDelete();
}

function updateFormAction(formId, selectId)
{
    const projectsForm = document.getElementById(formId);
    const selected = document.getElementById(selectId);
    projectsForm.action = selected.value;
    console.log("updated form action to ", projectsForm.action);
    projectsForm.submit();
}