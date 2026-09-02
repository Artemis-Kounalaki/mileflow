package gr.mileflow.app.core.exceptions;

import lombok.Getter;

public class AppGenericException extends Exception{

    @Getter

        private final String code;

        public AppGenericException(String code, String message){
            super(message);
            this.code = code;
        }

    }


