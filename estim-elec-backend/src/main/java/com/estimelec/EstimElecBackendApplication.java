package com.estimelec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class EstimElecBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EstimElecBackendApplication.class, args);
    }

}
