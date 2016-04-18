package com.runt9;

import com.runt9.model.Project;
import com.runt9.model.Release;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@SpringBootApplication
public class Application extends RepositoryRestConfigurerAdapter {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration configuration) {
        configuration.exposeIdsFor(Project.class);
        configuration.exposeIdsFor(Release.class);

    }
}
