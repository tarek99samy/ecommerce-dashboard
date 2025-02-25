import axiosClient from '../utils/AxiosClient';
import useStore from '../store/store';

export default class ApiService {
  constructor(entityName) {
    this.entityName = entityName;
  }

  getAll = async (objName, haveArabicName = true) => {
    let response;
    await axiosClient
      .get(`/${this.entityName}/all`)
      .then((res) => {
        if (haveArabicName) {
          response = res.data[objName].map((item) => ({ ...item, name: item.name_ar }));
        } else {
          response = res.data[objName];
        }
        useStore.getState().setEntity(objName, response);
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  addSingle = async (data) => {
    let response;
    await axiosClient
      .post(`/${this.entityName}`, data)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  addMany = async (data) => {
    let response;
    await axiosClient
      .post(`/${this.entityName}/many`, data)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  archiveSingle = async (data) => {
    let response;
    const archiveData = {
      entity_id: data.id,
      entity_type: this.entityName,
      reason: data.reason || null
    };
    await axiosClient
      .post(`/archive`, archiveData)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  editSingle = async (id, data) => {
    let response;
    await axiosClient
      .put(`/${this.entityName}/${id}`, data)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  toggle = async (data) => {
    let response;
    await axiosClient
      .put(`/${this.entityName}/toggle`, data)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  deleteSingle = async (id) => {
    let response;
    await axiosClient
      .delete(`/${this.entityName}/${id}`)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  deleteSingleDynamic = async (id, type) => {
    let response;
    await axiosClient
      .delete(`/${this.entityName}/${id}/${type}`)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  uploadFile = async (id, key, files) => {
    let response;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(key, files[i]);
    }
    await axiosClient
      .post(`/upload-file/${this.entityName}/${id}`, formData)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };

  deleteFiles = async (id, data) => {
    let response;
    await axiosClient
      .delete(`/upload-file/${this.entityName}/${id}`, { data })
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        response = err.response;
        console.log(err);
      });
    return response;
  };
}
