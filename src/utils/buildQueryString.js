const buildQueryString = (filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) {
        // Para el filtro de is_active: convertir "Activo" a "true" y "Inactivo" a "false"
        if (key === "is_active") {
          value = value.toLowerCase() === "activo" ? "true" : "false";
        }
        // Para is_staff: convertir "Sí" a "true", "No" a "false"
        if (key === "is_staff") {
          if (value.toLowerCase() === "sí") {
            value = "true";
          } else if (value.toLowerCase() === "no") {
            value = "false";
          }
        }
        queryParams.append(key, value);
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  };
  